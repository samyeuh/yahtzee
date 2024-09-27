import { Box, Flex, Link } from '@chakra-ui/react';

const Navbar = () => {

  return (
    <Box as="nav" py={4} px={8} boxShadow="md">
    <Flex justify="space-between" align="center">
        <Link href="/" fontSize="lg" fontWeight="bold" color="gray.600">
            Accueil
        </Link>
    </Flex>
    </Box>
  );
};

export default Navbar;