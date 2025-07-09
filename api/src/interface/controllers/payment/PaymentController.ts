import { inject, injectable } from "tsyringe";
import { ISlotRepository } from "../../../entities/repositoryInterface/turf/ISlotRepository";
import Stripe from "stripe";
import { config } from "../../../shared/config";
import { IPaymentControllers } from "../../../entities/controllerInterfaces/Payment/IPaymentControllers";
import { Request, Response } from "express";
import { IRedisClient } from "../../../entities/services/IRedisClient";
import { IPaymentService } from "../../../entities/services/IPaymentService";
import { CustomRequest } from "../../middlewares/authMiddleware";




@injectable()
export  class PaymentController implements IPaymentControllers{
    private stripe:Stripe;
    constructor(
        @inject("ISlotRepository") private _slotRepo:ISlotRepository,
        @inject("IRedisClient") private _redis:IRedisClient,
        @inject("IPaymentService") private _paymentService:IPaymentService
    ){
        this.stripe = new Stripe(config.stripe,{
            apiVersion:"2025-04-30.basil"
        })
    }
    async createPaymentIntent(req: Request, res: Response): Promise<void> {
        try {
            const { slotId, price, durarion } = req.body as {
                slotId: string;
                price: number;
                durarion: number;
            };
            const userId = (req as CustomRequest).user.id;

            if (!slotId) {
                const paymentIntent = await this._paymentService.createPaymentIntent(price);
                res.json({ clientSecret: paymentIntent.clientSecret });
                return;
            }

            const lockKey = `slot_lock:${slotId}`;
            const slot = await this._slotRepo.findById(slotId);

            if (!slot) {
                res.status(404).json({ error: "Slot not found" });
                return;
            }
            const currentLockOwner = await this._redis.get(lockKey);
            if (currentLockOwner && currentLockOwner !== userId) {
                res.status(400).json({ error: "Slot is currently locked by another user" });
                return;
            }
            await this._redis.set(lockKey, userId, "PX", 30000);

            if (slot.isBooked) {
                const owner = await this._redis.get(lockKey);
                if (owner === userId) {
                    await this._redis.del(lockKey);
                }

                res.status(400).json({ error: "Slot already booked" });
                return;
            }

            try {
                const paymentIntent = await this._paymentService.createPaymentIntent(price, slotId);

                res.json({
                    clientSecret: paymentIntent.clientSecret,
                    lockId: userId,
                });
                return;
            } catch (err) {
                const owner = await this._redis.get(lockKey);
                if (owner === userId) {
                    await this._redis.del(lockKey);
                }
                console.error("PaymentIntent creation failed:", err);
                res.status(500).json({ error: "Failed to create payment" });
                return;
            }
        } catch (error) {
            console.error("PaymentIntent creation failed:", error);
            res.status(500).json({ error: "Failed to create payment" });
        }
    }

}