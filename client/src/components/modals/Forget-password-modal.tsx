import React, { useState } from "react";
import { useToast } from "../../hooks/useToast";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (email: string) => Promise<void>;
};

const ForgotPasswordModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message,setMessage]=useState<string>("")
    const { toast } = useToast();

    const handleSubmit = async () => {
        if (!email) return;
        setIsSubmitting(true);
        try {
        await onSubmit(email);
        setMessage("Email send")
        toast({
            title: "Check your email",
            description: "A password reset link has been sent.",
            duration: 3000,
        });
        setEmail("")
        setMessage("")
        onClose();
        
        } catch (error: any) {
        toast({
            title: "Error",
            description: error.message || "Failed to send reset email.",
            variant: "destructive",
        });
        } finally {
        setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm z-50">
        <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4">Reset Password</h2>
            <input
            type="email"
            className="w-full border px-3 py-2 mb-4 rounded"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            {message && <p className="flex items-center text-green-600 bg-green-100 border border-green-300 rounded px-4 py-2 text-sm">
            <svg
                className="w-4 h-4 mr-2 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {message}
            </p>}
            <div className="flex justify-end space-x-2">
            <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={onClose}
                disabled={isSubmitting}
            >
                Cancel
            </button>
            <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
            </div>
        </div>
        </div>
    );
};

export default ForgotPasswordModal;
