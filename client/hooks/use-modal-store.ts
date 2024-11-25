import { create } from 'zustand';

export type ModalType =
    | 'createRecord'
    | 'deleteRecord'


interface ModalData {
    website?: string;
    username?: string;
    password?: string;
    index?: number;
}

interface ModalStore {
    type: ModalType | null;
    data: ModalData;
    isOpen: boolean;
    // eslint-disable-next-line no-unused-vars
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
    onClose: () => set({ type: null, isOpen: false }),
}));
