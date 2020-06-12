import React from 'react';

const UserContext = React.createContext({});

export const WithContext = ToRender => {
	return (props) => (
		<UserContext.Consumer>
			{ userData => <ToRender {...props} context={userData} /> }
		</UserContext.Consumer>
	)
}
export default UserContext;
