const MESSAGES: Record<string, string> = {
  NotAllowedError:
    "L'accès à l'appareil photo est bloqué. Autorisez-le dans les Paramètres, rubrique Autorisations.",
  NotFoundError: "Aucun appareil photo n'a été trouvé sur cet appareil.",
  NotReadableError:
    "L'appareil photo est déjà utilisé par une autre application. Fermez-la, puis réessayez.",
};

export function useCamera(video: Ref<HTMLVideoElement | null>) {
  const ready = ref(false);
  const error = ref("");
  let stream: MediaStream | null = null;

  async function start() {
    error.value = "";
    if (!navigator.mediaDevices?.getUserMedia) {
      error.value = "Ce navigateur ne donne pas accès à l'appareil photo.";
      return;
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 2560 },
          height: { ideal: 1440 },
        },
      });
      if (!video.value) return stop();
      video.value.srcObject = stream;
      await video.value.play();
      ready.value = true;
    } catch (e) {
      stop();
      error.value =
        MESSAGES[(e as DOMException).name] ??
        "Impossible d'ouvrir l'appareil photo. Réessayez.";
    }
  }

  function stop() {
    stream?.getTracks().forEach((track) => track.stop());
    stream = null;
    ready.value = false;
    if (video.value) video.value.srcObject = null;
  }

  async function capture() {
    const source = video.value!;
    const canvas = document.createElement("canvas");
    canvas.width = source.videoWidth;
    canvas.height = source.videoHeight;
    canvas.getContext("2d")!.drawImage(source, 0, 0);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.92),
    );
    if (!blob) throw new Error("Capture impossible.");
    return new File([blob], "ticket.jpg", { type: "image/jpeg" });
  }

  onBeforeUnmount(stop);

  return { ready: readonly(ready), error, start, stop, capture };
}
