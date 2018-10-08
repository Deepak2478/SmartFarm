package sap.invent.dambusters.CropManager.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import antlr.collections.List;
import sap.invent.dambusters.CropManager.entities.Alerts;
import sap.invent.dambusters.CropManager.entities.Crop;
import sap.invent.dambusters.CropManager.entities.Person;
import sap.invent.dambusters.CropManager.repositories.AlertsRepository;
import sap.invent.dambusters.CropManager.repositories.PersonRepository;

@RestController
@RequestMapping(path = "/api/alerts")
public class AlertsController extends BaseApiController{
	
	@Autowired
	AlertsRepository alersRepo;
	

	@Autowired
	PersonRepository personRepo;
	

	@GetMapping(path = "/all")
	public @ResponseBody Iterable<Alerts> getAllCrops() {
java.util.List<Alerts> alertList= (java.util.List<Alerts>) alersRepo.findAll();
	for(Alerts a :alertList){
		Person person = personRepo.findById(a.getFarmerId()).get();
		a.setFarmerName(person.getName());
	}

		return alertList;
	}
	@PostMapping(path = "updateAlert")
	public @ResponseBody String updateRemidiationAndStatus(@RequestBody Alerts alert){
		alersRepo.save(alert);
		return "Success";
	}
	

}
