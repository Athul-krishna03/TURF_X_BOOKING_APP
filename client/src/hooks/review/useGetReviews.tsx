import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addReview, getReviews } from "../../services/user/userServices";


export const useReviews = (turfId: string) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["reviews", turfId],
        queryFn: () => getReviews(turfId),
    });

    const mutation = useMutation({
        mutationFn: addReview,
        onSuccess: () => {
        // Invalidate the cache to refetch updated reviews
        queryClient.invalidateQueries({ queryKey: ["reviews", turfId] });
        },
    });

    return {
        ...query,
        addReview: mutation.mutateAsync,
        isAddingReview: mutation.isPending,
    };
};