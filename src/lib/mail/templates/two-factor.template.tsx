/* eslint-disable prettier/prettier */
import { Body, Heading, Text } from '@react-email/components';
import { Html } from '@react-email/html';
import React from 'react';

interface TwoFactorTemplateProps {
	token: string;
}

export function TwoFactorTemplate({token }: TwoFactorTemplateProps) {
	return (
<Html>
			<Body>
				<Heading>Двухфакторная аутентификация</Heading>
				<Text>Ваш код двухфакторной аутентификации: <strong>{token}</strong></Text>
				<Text>Пожалуйста, введите этот код в приложении для завершения процесса аутентификации.</Text>
				<Text>Если вы не запрашивали подтверждение, просто проигнорируйте это сообщение.</Text>
				<Text>Спасибо за использование нашего сервиса.</Text>
			</Body>
    </Html>
	)
}
