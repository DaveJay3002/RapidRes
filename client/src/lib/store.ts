import { create } from "zustand";
import type { MessageType } from "./types";

export const useMessagesStore = create<{
	messages: MessageType[];
	addMessage: (message: MessageType) => void;
}>((set) => ({
	messages: [],
	addMessage: (message) =>
		set((state) => ({ messages: [...state.messages, message] })),
}));
