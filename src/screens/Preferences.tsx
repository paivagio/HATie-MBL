import { VStack } from 'native-base';
import { Menu } from '../components/Menu';

export function Preferences() {
    return (
        <VStack>
            <Menu variant="blank" preferences />
        </VStack>
    );
}