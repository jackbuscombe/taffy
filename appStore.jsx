import create from "zustand";

export const useStore = create((set) => ({
	signupModalOpen: false,
	setSignupModalOpen: () => set((state) => ({ signupModalOpen: !state.signupModalOpen })),

	endDate: undefined,
	setEndDate: (x) => set(() => ({ endDate: x })),
}));
