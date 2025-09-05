/* eslint-disable prettier/prettier */
import { Body, Heading, Link, Text } from '@react-email/components';
import { Html } from '@react-email/html';
import React from 'react';

interface ConfirmationTemplateProps {
	domain: string;
	token: string;
}

export function ConfirmationTemplate({ domain, token }: ConfirmationTemplateProps) {
	const confirmLink = `${domain}/auth/new-verification?token=${token}`;

	return (
		<Html>
			<Body>
				<Heading>Подтверждение почты</Heading>
				<Text>Привет! Чтобы подтвердить свой адрес электронной почты, пожалуйста, перейди по следующей ссылке:</Text>
				<Link href={confirmLink}>Подтвердить почту</Link>
				<Text>Эта ссылка действительна в течении 1 часа. Если вы не запрашивали подтверждение, просто проигнорируйте это сообщение.</Text>
				<Text>Спасибо за использование нашего сервиса.</Text>
			</Body>
		</Html>
	)
}
