import { VStack } from 'native-base';
import { Header } from '../components/Header';
import { Menu } from '../components/Menu';

export function SummaryDetails() {
    return (
        <VStack flex={1} bg="background">
            <Header title="Detalhes da sumarização" mr={75} />

            <VStack flex={1} px={6}>

            </VStack>

            <Menu variant="blank" />
        </VStack>
    );
}