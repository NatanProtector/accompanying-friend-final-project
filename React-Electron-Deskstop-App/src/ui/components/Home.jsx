import StandardContainer from "./StandardContainer";

export default function Home() {
    return (
        <StandardContainer>
            <div
                style={style.container}
            >
                <h2>Home Page</h2>
            </div>
        </StandardContainer>
    );
}

const style = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
    }
}