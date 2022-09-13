import React from 'react';
import { AvatarContainer, Text, StyleSheet } from 'react-native';


export const UserHeader = () => {

    const bodyText = 'Aqui existe um avatar'

    return(
        <>
            <Text>
                {bodyText}
            </Text>
            {/*
                <AvatarContainer>
                    <Avatar
                        containerStyle={[styles.avatar, { zIndex: index-- }]}
                        size={scale(60)}
                        source={handleAvatar(avatar)}
                        title={getInitials(user.user_name)}
                        rounded
                    />
                    {households.map((household) => (
                        <Avatar
                            key={household.id}
                            containerStyle={[styles.avatars, { zIndex: index-- }]}
                            size={scale(60)}
                            source={handleAvatar(householdAvatars[household.id])}
                            title={getInitials(household.description)}
                            rounded
                        />
                    ))}
                </AvatarContainer>
            */}
        </>

    );
}

const styles = StyleSheet.create({
    container: {
      color: '#fff',
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
