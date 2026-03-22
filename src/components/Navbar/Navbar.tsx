import { Box, Flex, Link } from '@chakra-ui/react';
import { useState } from 'react';
import { SettingsModal } from '../../modals/SettingsModal/SettingsModal';

const Navbar = () => {
  const [homeButton, setHomeButton] = useState("/logo/yahtzee.png");
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <Box as="nav" py={4} px={8} boxShadow="md">
        <Flex justify="space-between" align="center">
          <Link href="/" fontSize="lg" fontWeight="bold" color="gray.600">
            <img
              src={homeButton}
              onMouseOver={() => setHomeButton("/logo/yahtzee.gif")}
              onMouseLeave={() => setHomeButton("/logo/yahtzee.png")}
              style={{ height: "19px", width: "126px" }}
            />
          </Link>
          <Flex align="center" gap={3}>
            <button
              onClick={() => setSettingsOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
              }}
              title="settings"
            >
              <img src="/dices/settings.png" style={{ height: '22px', width: '22px' }} alt="settings" />
            </button>
            <Link onClick={() => window.open('https://github.com/samyeuh/yahtzee')} fontSize="lg" fontWeight="bold" color="gray.600">
              <img src="/dices/github.png" style={{ height: '22px', width: '22px' }} />
            </Link>
          </Flex>
        </Flex>
      </Box>

      {settingsOpen && (
        <SettingsModal closeFunction={() => setSettingsOpen(false)} />
      )}
    </>
  );
};

export default Navbar;