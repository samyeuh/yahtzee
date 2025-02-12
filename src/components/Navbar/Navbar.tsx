import { Box, Flex, Link } from '@chakra-ui/react';
import { useState } from 'react';

const Navbar = () => {

  const [homeButton, setHomeButton] = useState("/logo/yahtzee.png");

  return (
    <Box as="nav" py={4} px={8} boxShadow="md">
    <Flex justify="space-between" align="center">
        <Link href="/" fontSize="lg" fontWeight="bold" color="gray.600">
            <img src={homeButton} 
            onMouseOver={() => setHomeButton("/logo/yahtzee.gif")}
            onMouseLeave={() => setHomeButton("/logo/yahtzee.png")} 
            style={{height: "19px", width: "126px"}}/>
        </Link>
        <Link onClick={() => (window.open('https://github.com/samyeuh/yahtzee'))} fontSize="lg" fontWeight="bold" color="gray.600">
          <img src="/dices/github.png" style={{height:'22px', width: '22px'}}/>
        </Link>
    </Flex>
    </Box>
  );
};

export default Navbar;