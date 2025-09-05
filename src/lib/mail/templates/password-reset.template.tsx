/* eslint-disable prettier/prettier */
import { Body, Heading, Link, Text } from '@react-email/components';
import { Html } from '@react-email/html';
import React from 'react';

interface PasswordResetTemplateProps {
	domain: string;
	token: string;
}

export function PasswordResetTemplate({ domain, token }: PasswordResetTemplateProps) {
	const confirmLink = `${domain}/auth/new-password?token=${token}`;

	return (
		<Html>
			<Body>
				<Heading>Сброс пароля</Heading>
				<Text>Привет! Вы запросили сброс пароля. Пожалуйста, перейди по следующей ссылке, чтобы создать новый пароль:</Text>
				<Link href={confirmLink}>Подтвердить сброс пароля</Link>
				<Text>Эта ссылка действительна в течении 1 часа. Если вы не запрашивали подтверждение, просто проигнорируйте это сообщение.</Text>
				<Text>Спасибо за использование нашего сервиса.</Text>
			</Body>
    </Html>
  );
}
