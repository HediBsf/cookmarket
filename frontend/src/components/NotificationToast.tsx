"use client";

import { useEffect, useRef } from "react";
import { Bell, X } from "lucide-react";

export type ToastNotification = {
  id: number;
  title: string;
  message: string;
};

export default function NotificationToast({
  notification,
  onClose,
  onDismiss,
}: {
  notification: ToastNotification | null;
  onClose: (id: number) => void;
  onDismiss?: (id: number) => void;
}) {
  const onCloseRef = useRef(onClose);
  const onDismissRef = useRef(onDismiss);

  useEffect(() => {
    onCloseRef.current = onClose;
    onDismissRef.current = onDismiss;
  }, [onClose, onDismiss]);

  useEffect(() => {
    if (!notification) {
      return;
    }

    playNotificationSound();
    const timeoutId = window.setTimeout(() => {
      if (onDismissRef.current) {
        onDismissRef.current(notification.id);
      } else {
        onCloseRef.current(notification.id);
      }
    }, 10000);
    return () => window.clearTimeout(timeoutId);
  }, [notification?.id]);

  if (!notification) {
    return null;
  }

  return (
    <div className="fixed right-4 top-24 z-[80] w-[calc(100vw-2rem)] max-w-sm rounded-lg border border-green-200 bg-white p-4 shadow-[0_18px_55px_rgba(20,83,45,0.18)]">
      <div className="flex items-start gap-3">
        <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700">
          <Bell size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-extrabold text-stone-950">{notification.title}</p>
          <p className="mt-1 text-sm text-stone-600">{notification.message}</p>
          <button className="mt-3 text-sm font-bold text-red-900" onClick={() => onClose(notification.id)}>
            Marquer comme lu
          </button>
        </div>
        <button
          type="button"
          onClick={() => onClose(notification.id)}
          className="rounded-full p-1 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
          aria-label="Fermer la notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

function playNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }
    const audioContext = new AudioContextClass();
    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(0.08, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.45);
    gain.connect(audioContext.destination);

    [660, 880].forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + index * 0.12);
      oscillator.connect(gain);
      oscillator.start(audioContext.currentTime + index * 0.12);
      oscillator.stop(audioContext.currentTime + index * 0.12 + 0.18);
    });
  } catch {
    // Browsers can block sound before user interaction; the visual notification still appears.
  }
}
