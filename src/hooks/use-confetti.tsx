import Confetti from 'react-confetti';

export const AppConfetti = () => {
    
    const { innerWidth: width, innerHeight: height } = window;
    
    return (
        <Confetti
            tweenDuration={1000}
            width={width}
            height={height}
        />
    )
}
