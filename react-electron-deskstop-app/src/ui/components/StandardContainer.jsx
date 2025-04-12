const StandardContainer = ({ children }) => {
    return (
        <div
            style={style.container}
        >
            {children}
        </div>
    )
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

export default StandardContainer;
