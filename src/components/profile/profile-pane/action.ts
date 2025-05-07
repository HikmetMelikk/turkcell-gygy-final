"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
type ProfileUpdateData = {
	nickname: string;
	phone: string;
};

export async function updateProfile(userId: string, data: ProfileUpdateData) {
	try {
		const supabase = await createClient();

		const { error } = await supabase.auth.updateUser({
			data: {
				nickname: data.nickname,
				phone: data.phone,
			},
		});

		if (error) {
			throw error;
		}

		const { error: profileError } = await supabase
			.from("profiles")
			.update({
				nickname: data.nickname,
				phone: data.phone,
				updated_at: new Date().toISOString(),
			})
			.eq("id", userId);
		revalidatePath("/profile");

		if (profileError) {
			throw profileError;
		}

		return { success: true };
	} catch (error: any) {
		console.error("Profile update error:", error);
		return {
			success: false,
			error: error.message || "Failed to update profile",
		};
	}
}
