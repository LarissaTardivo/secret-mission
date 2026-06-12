import { useEffect, useState } from "react";
import { Button, Input, Text, VStack } from "@chakra-ui/react";
import Confetti from "react-confetti";

type PersonType = "man" | "woman" | "couple" | "";

interface Props {
  step: any;
  name: string;
  setName: (name: string) => void;
  nextStep: () => void;
  accept: () => void;
  accepted: boolean;
  personType?: PersonType;
  setPersonType?: (type: PersonType) => void;
}

export default function MissionStep({ step, name, setName, nextStep, accept, accepted, setPersonType }: Props) {
  const [count, setCount] = useState(3);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (step.type === "countdown") {
      const timer = setTimeout(() => {
        if (count <= 1) nextStep();
        else setCount(count - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [count, nextStep, step.type]);

  const renderConfetti = step.type === "final" && accepted

  switch (step.type) {
    case "input":
      return (
        <VStack textAlign="center">
          <Text fontSize="2xl" fontWeight="bold">{step.title}</Text>
          <Text mb="1rem">{step.content}</Text>
          <Input
            placeholder="Digite seu nome secreto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            borderColor="brandBlue"
          />
          <Button w="full" bgGradient="linear(to-r, brandOrange, brandYellow)" color="white" onClick={nextStep}>
            Confirmar
          </Button>
        </VStack>
      );

    case "choice":
      return (
        <VStack textAlign="center">
          <Text fontSize="2xl" fontWeight="bold">{step.title}</Text>
          <Text mb="1rem">{step.content}</Text>
          <Button w="full" colorScheme="orange" onClick={nextStep}>Sim, com certeza</Button>
          <Button w="full" colorScheme="orange" variant="outline" onClick={nextStep}>Claro que sim</Button>
        </VStack>
      );

    case "info":
      return (
        <VStack textAlign="center">
          <Text fontSize="2xl" fontWeight="bold">{step.title}</Text>
          <Text>{step.content}</Text>
          <Button mt="1rem" w="full" colorScheme="orange" onClick={nextStep}>Continuar</Button>
        </VStack>
      );

    case "confirm":
      return (
        <VStack textAlign="center">
          <Text mb="0.5rem" fontSize="2xl" fontWeight="bold">{step.title}</Text>
          <Text>{step.content}</Text>
          <Button mt="1rem" w="full" bgGradient="linear(to-r, brandOrange, brandYellow)" color="white" onClick={nextStep}>
            Prometo 💖
          </Button>
        </VStack>
      );

    case "countdown":
      return (
        <VStack textAlign="center">
          <Text fontSize="2xl" fontWeight="bold">{step.title}</Text>
          <Text fontSize="6xl" fontWeight="bold" color="brandOrange">{count}</Text>
        </VStack>
      );

    case "final":
      return (
        <VStack textAlign="center">
          {renderConfetti && (
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={300}
            />
          )}
          <Text fontSize="2xl" fontWeight="bold">{step.title}</Text>
          <Text fontSize="lg" color="brandBlue">{name}, {step.content}</Text>
          {!accepted ? (
            <Button w="full" bgGradient="linear(to-r, brandOrange, brandYellow)" color="white" fontWeight="bold" onClick={accept}>
              SIM 💖
            </Button>
          ) : (
            <Text fontSize="xl" fontWeight="bold" color="brandOrange">🎉 MISSÃO CONCLUÍDA!</Text>
          )}
        </VStack>
      );

    case "gender-select":
      return (
        <VStack textAlign="center">
          <Text fontSize="2xl" fontWeight="bold">{step.title}</Text>
          <Text mb="1rem">{step.content}</Text>
          <Button w="full" bgGradient="linear(to-r, brandOrange, brandYellow)" color="white" onClick={() => { setPersonType?.("man"); nextStep(); }}>
            Homem
          </Button>
          <Button w="full" bgGradient="linear(to-r, brandOrange, brandYellow)" color="white" onClick={() => { setPersonType?.("woman"); nextStep(); }}>
            Mulher
          </Button>
          <Button w="full" colorScheme="orange" variant="outline" onClick={() => { setPersonType?.("couple"); nextStep(); }}>
            Somos um casal
          </Button>
        </VStack>
      );

    default:
      return null;
  }
}
