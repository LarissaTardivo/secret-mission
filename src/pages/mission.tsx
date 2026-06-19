import { useState, useRef, useEffect } from "react";
import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { useSteps } from "chakra-ui-steps";
import { motion, AnimatePresence } from "framer-motion";
import VideoStep from "../components/video-step";
import GameStep from "../components/game-step";
import DrawStep from "../components/draw-step";
import MissionStep from "../components/mission-step";

const Mission = () => {
  const { nextStep, activeStep } = useSteps({ initialStep: 0 });

  const [name, setName] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [personType, setPersonType] = useState<"man" | "woman" | "couple" | "">();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const bgColor = useColorModeValue("white", "gray.800");
  const gradientBg = "linear(to-br, brandSoftOrange, brandSoftBlue)";

  useEffect(() => {
    audioRef.current = new Audio("/sounds/applause.mp3");
  }, []);

  const handleAccept = () => {
    setAccepted(true);
    audioRef.current?.play();
  };

  const finalContent = {
    man: "em breve estaremos noivos e queremos saber se você aceita ser nosso padrinho de Casamento?",
    woman: "em breve estaremos noivos e queremos saber se você aceita ser nossa madrinha de Casamento?",
    couple: "em breve estaremos noivos e queremos saber se vocês aceitam ser nossos padrinhos de Casamento?",
  };

  const sharedProps = { name, setName, nextStep, accept: handleAccept, accepted, personType, setPersonType };

  const stepsContent = [
    {
      label: "Início",
      content: (
        <MissionStep
          step={{ type: "input", title: "Missão Secreta 🕵🏼‍♂️", content: "Para começar, como você quer ser chamado?" }}
          {...sharedProps}
        />
      ),
    },
    {
      label: "Identidade",
      content: (
        <MissionStep
          step={{ type: "gender-select", title: "Missão Secreta 🕵🏼‍♂️", content: "Você está acessando essa missão como:" }}
          {...sharedProps}
        />
      ),
    },
    {
      label: "Desafio",
      content: (
        <MissionStep
          step={{ type: "choice", title: "Missão Secreta 🕵🏼‍♂️", content: "Agora que já sabemos quem você é, vamos apresentar a missão secreta. Será que você tem coragem de realizá-la?" }}
          {...sharedProps}
        />
      ),
    },
    {
      label: "Mensagem",
      content: (
        <MissionStep
          step={{ type: "info", title: "Relatório Confidencial", content: "Saiba que se está participando dessa missão, significa que você é muito importante." }}
          {...sharedProps}
        />
      ),
    },
    {
      label: "Habilidades",
      content: <GameStep nextStep={nextStep} />,
    },
    {
      label: "Desenho",
      content: <DrawStep nextStep={nextStep} />,
    },
     {
      label: "Mensagem",
      content: (
        <MissionStep
          step={{ type: "info", title: "Relatório Confidencial", content: "Agora que você cumpriu dois dos desafios, vamos continuar nossa jornada." }}
          {...sharedProps}
        />
      ),
    },
    {
      label: "Mensagem",
      content: (
        <MissionStep
          step={{ type: "info", title: "Relatório Confidencial", content: "O agente principal dessa missão é Deus, e..." }}
          {...sharedProps}
        />
      ),
    },
    {
      label: "Missão",
      content: <VideoStep src="/videos/new-secret-mission-video.mp4" nextStep={nextStep} />,
    },
    {
      label: "Mensagem",
      content: (
        <MissionStep
          step={{ type: "info", title: "Missão Secreta 🕵🏼‍♂️", content: "Continue para revelar" }}
          {...sharedProps}
        />
      ),
    },
    {
      label: "Mensagem",
      content: (
        <MissionStep
          step={{ type: "info", title: "Missão Secreta 🕵🏼‍♂️", content: "Essa missão inicia hoje e continua no dia 10/07/2027, entre nós e Deus no altar e queremos te fazer um convite 🥰" }}
          {...sharedProps}
        />
      ),
    },
    {
      label: "Contrato",
      content: (
        <MissionStep
          step={{ type: "confirm", title: "Mas antes disso...", content: "Você promete estar ao nosso lado nesta nova jornada nos apoiando e intercedendo por nós sempre?" }}
          {...sharedProps}
        />
      ),
    },
    {
      label: "Preparar",
      content: (
        <MissionStep
          step={{ type: "countdown", title: "Então vem aí a sua missão", content: "O grande momento em..." }}
          {...sharedProps}
        />
      ),
    },
    {
      label: "O Pedido",
      content: (
        <MissionStep
          step={{ type: "final", title: "Missão secreta🕵🏼‍♂️", content: finalContent[personType as keyof typeof finalContent] ?? finalContent.couple }}
          {...sharedProps}
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