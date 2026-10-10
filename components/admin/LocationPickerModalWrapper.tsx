"use client";

import dynamic from "next/dynamic";

const LocationPickerModal = dynamic(() => import("./LocationPickerModal"), {
  ssr: false,
});

type Props = {
  initialLat?: number;
  initialLng?: number;
  initialLocationName?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (locationName: string, lat: number, lng: number) => void;
};

export default function LocationPickerModalWrapper(props: Props) {
  if (!props.isOpen) return null;
  return <LocationPickerModal {...props} />;
}
