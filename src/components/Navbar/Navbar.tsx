import { Box, Flex, Link } from '@chakra-ui/react';
import { useState } from 'react';

const Navbar = () => {

  const [homeButton, setHomeButton] = useState("/yahtzee.png");

  return (
    <Box as="nav" py={4} px={8} boxShadow="md">
    <Flex justify="space-between" align="center">
        <Link href="/" fontSize="lg" fontWeight="bold" color="gray.600">
            <img src={homeButton} 
            onMouseOver={() => setHomeButton("/yahtzee.gif")}
            onMouseLeave={() => setHomeButton("/yahtzee.png")} 
            style={{height: "19px", width: "126px"}}/>
        </Link>
    </Flex>
    </Box>
  );
};

export default Navbar;