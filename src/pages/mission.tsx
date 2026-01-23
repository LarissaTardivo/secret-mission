import { useState, useRef, useEffect } from "react";
import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { useSteps } from "chakra-ui-steps";
import { motion, AnimatePresence } from "framer-motion";
import VideoStep from "../components/video-step";
import MissionStep from "../components/mission-step";

const Mission = () => {
  const { nextStep, activeStep } = useSteps({ initialStep: 0 });

  const [name, setName] = useState("");
  const [accepted, setAccepted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const bgColor = useColorModeValue("white", "gray.800");
  const gradientBg = "linear(to-br, pink.50, orange.50)";

  useEffect(() => {
    audioRef.current = new Audio("/sounds/applause.mp3");
  }, []);

  const handleAccept = () => {
    setAccepted(true);
    audioRef.current?.play();
  };

  const stepsContent = [
    {
      label: "Início",
      content: (
        <MissionStep
          step={{ type: "input", title: "Missão Secreta 🕵🏼‍♂️", content: "Para começar, como você quer ser chamado?" }}
          name={name}
          setName={setName}
          nextStep={nextStep}
          accept={handleAccept}
          accepted={accepted}
        />
      ),
    },
    {
      label: "Desafio",
      content: (
        <MissionStep
          step={{ type: "choice", title: "Missão Secreta 🕵🏼‍♂️", content: "Agora que já sabemos quem você é, vamos apresentar a missão secreta. Nos promete guardar segredo? 🤫" }}
          name={name}
          setName={setName}
          nextStep={nextStep}
          accept={handleAccept}
          accepted={accepted}
        />
      ),
    },
    {
      label: "Mensagem",
      content: (
        <MissionStep
          step={{ type: "info", title: "Relatório Confidencial", content: "Saiba que se você está participando dessa missão, significa que é muito importante para nós." }}
          name={name}
          setName={setName}
          nextStep={nextStep}
          accept={handleAccept}
          accepted={accepted}
        />
      ),
    },
    {
      label: "Mensagem",
      content: (
        <MissionStep
          step={{ type: "info", title: "Relatório Confidencial", content: "O agente principal dessa missão é Deus, e..." }}
          name={name}
          setName={setName}
          nextStep={nextStep}
          accept={handleAccept}
          accepted={accepted}
        />
      ),
    },
    {
      label: "Missão",
      content: <VideoStep src="/videos/secret-mission-video.mp4" nextStep={nextStep} />,
    },
    {
      label: "Mensagem",
      content: (
        <MissionStep
          step={{ type: "info", title: "Missão Obra Nova", content: "Eis que ela já surge, não a vedes?" }}
          name={name}
          setName={setName}
          nextStep={nextStep}
          accept={handleAccept}
          accepted={accepted}
        />
      ),
    },
    {
      label: "Mensagem",
      content: (
        <MissionStep
          step={{ type: "info", title: "Missão Obra Nova", content: "Essa missão inicia hoje e continua no dia 01/05/2027, entre nós e Deus no altar e queremos te fazer um convite 🥰" }}
          name={name}
          setName={setName}
          nextStep={nextStep}
          accept={handleAccept}
          accepted={accepted}
        />
      ),
    },
    {
      label: "Contrato",
      content: (
        <MissionStep
          step={{ type: "confirm", title: "Mas antes disso...", content: "Você promete estar ao nosso lado nesta nova jornada nos apoiando e intercedendo por nós sempre?" }}
          name={name}
          setName={setName}
          nextStep={nextStep}
          accept={handleAccept}
          accepted={accepted}
        />
      ),
    },
    {
      label: "Preparar",
      content: (
        <MissionStep
          step={{ type: "countdown", title: "Então vem aí a sua missão", content: "O grande momento em..." }}
          name={name}
          setName={setName}
          nextStep={nextStep}
          accept={handleAccept}
          accepted={accepted}
        />
      ),
    },
    {
      label: "O Pedido",
      content: (
        <MissionStep
          step={{ type: "final", title: "Missão secreta", content: "Você aceita ser nossa Madrinha de Casamento?" }}
          name={name}
          setName={setName}
          nextStep={nextStep}
          accept={handleAccept}
          accepted={accepted}
        />
      ),
    },
  ];

  return (
    <Flex minH="100vh" align="center" justify="center" bgGradient={gradientBg} p={4}>
      <Box
        w="full"
        maxW="500px"
        bg={bgColor}
        rounded="3xl"
        p={{ base: 6, md: 10 }}
        shadow="2xl"
        position="relative"
        overflow="hidden"
      >
        <AnimatePresence exitBeforeEnter>
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            {...({} as any)}
          >
            <Box minH="350px" display="flex" flexDirection="column" justifyContent="center">
              {stepsContent[activeStep].content}
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Flex>
  );
};

export default Mission;