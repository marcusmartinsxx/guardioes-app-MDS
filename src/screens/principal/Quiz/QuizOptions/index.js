import { StyleSheet, Text } from 'react-native';
import { ModulesButton } from "../../../../components/ModulesButton";
import { UserHeader } from "../../../../components/UserHeader";

const QuizOptions = () => {
    return (
        <>
            <UserHeader />
            <Text>Quiz:</Text>
            <ModulesButton />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
});

export default QuizOptions;
