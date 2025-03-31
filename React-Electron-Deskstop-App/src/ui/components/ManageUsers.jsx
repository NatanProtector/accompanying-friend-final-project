import StandardContainer from "./StandardContainer";

const ManageUsers = () => {
    return (
        <StandardContainer>
            <div
                style={style.container}
            >
                <h2>Manage Users Page</h2>
            </div>
        </StandardContainer>
    )
};

export default ManageUsers;

const style = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: 'purple'
    }
}