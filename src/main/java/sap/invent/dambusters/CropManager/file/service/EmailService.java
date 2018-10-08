package sap.invent.dambusters.CropManager.file.service;

import org.springframework.stereotype.Service;

import mailgun.EmailSender;

@Service
public class EmailService {

	public static boolean sendMail(String subject, String toEmail, String contents) {
		return EmailSender.sendMail(subject, toEmail, contents);

	}
}
