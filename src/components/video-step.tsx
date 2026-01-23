import { Box, Text } from "@chakra-ui/react";

interface VideoStepProps {
  src: string;
  nextStep: () => void;
}

export default function VideoStep({ src, nextStep }: VideoStepProps) {
  return (
    <Box textAlign="center" >
      <Text fontSize="lg" fontWeight="bold">Ela faz parte de uma nova etapa de nossas vidas...</Text>
      <Text mb="1rem" fontSize="md" color="gray.600">Assista até o final para continuar a missão 🎬</Text>
      <video
        src={src}
        autoPlay
        controls
        className="w-full rounded-2xl mb-4"
        onEnded={nextStep}
      />
    </Box>
  );
}
