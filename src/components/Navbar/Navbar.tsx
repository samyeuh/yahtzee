import { Box, Flex, Link } from '@chakra-ui/react';
import { useGameplayContext } from '../../context/GameplayContext/GameplayContext';

const Navbar = () => {
  const { playerName } = useGameplayContext();
  return (
    <Box as="nav" bg="white" py={4} px={8} boxShadow="md">
    <Flex justify="space-between" align="center">
        <Link href="/" fontSize="lg" fontWeight="bold" color="gray.600">
            Accueil
        </Link>
        <Flex justify="space-between" align="center">
            <p> {playerName} </p>
        </Flex>
    </Flex>
    </Box>
  );
};

export default Navbar;