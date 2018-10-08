package sap.invent.dambusters.CropManager.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import sap.invent.dambusters.CropManager.entities.Person;
import sap.invent.dambusters.CropManager.file.service.EmailService;
import sap.invent.dambusters.CropManager.repositories.PersonRepository;
@RestController
@RequestMapping(BaseApiController.DOJOB_PATH)
public class MiscController {

	@Autowired
	PersonRepository personRepo;
	
	@GetMapping(path="/sendEmail") 
	public @ResponseBody String addLand(@RequestParam String subject,@RequestParam String body , @RequestParam String farmerId) {
		Person person = personRepo.findById(Integer.parseInt(farmerId)).get();
		
		EmailService.sendMail(subject, person.getEmailId() , body);
		return "Success";
	}
}
