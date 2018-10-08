package sap.invent.dambusters.CropManager.controllers;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import sap.invent.dambusters.CropManager.entities.Address;
import sap.invent.dambusters.CropManager.entities.Country;
import sap.invent.dambusters.CropManager.entities.Crop;
import sap.invent.dambusters.CropManager.entities.Land;
import sap.invent.dambusters.CropManager.entities.Person;
import sap.invent.dambusters.CropManager.repositories.AddressRepository;
import sap.invent.dambusters.CropManager.repositories.CropRepository;
import sap.invent.dambusters.CropManager.repositories.LandRepository;
import sap.invent.dambusters.CropManager.repositories.PersonRepository;

@RestController
@RequestMapping(BaseApiController.PERSON_PATH)
public class PersonController {
	
	@Autowired
	PersonRepository personRepo;
	
	@Autowired
	AddressRepository adddressRepo;
	
	@Autowired
	CropRepository cropRepo;
	
	@Autowired
	LandRepository landRepo;
	
	@GetMapping(path="/add") 
	public @ResponseBody String addNewUser (@RequestParam String name
			,  @RequestParam long contactNo,@RequestParam Integer addressId,@RequestParam Integer cropId) {
		
		Address address= (Address)adddressRepo.findById(addressId).get();
		Crop crop= (Crop)cropRepo.findById(cropId).get();
		//Land crop= (Crop)cropRepo.findById(cropId).get();
		Person p = new Person();
		p.setName(name);
		p.setContactNumber(contactNo);
		p.setAddress(address);
		personRepo.save(p);
		return p.getPersonId()+"";
	}
	
	@GetMapping(path="/all")
	public @ResponseBody Iterable<Person> getAllUsers() {
		// This returns a JSON or XML with the users
		return personRepo.findAll();
	}
	
	@PostMapping(path="/addFarmerWithPlot") 
	public @ResponseBody String addFarmerWithPlot(@RequestBody Person person ) {
		adddressRepo.save(person.getAddress());
		landRepo.save(person.getLand());
		personRepo.save(person);
		return person.getPersonId().toString();
	}
	
	@PostMapping(path="/saveProgress") 
	public @ResponseBody String saveProgress(HttpServletRequest request) {
		Integer farmerId = Integer.parseInt(request.getParameter("farmerId"));
		String sowing = (String)request.getParameter("sowing");
		String irrigation = (String)request.getParameter("irrigation");
		String harvesting = (String)request.getParameter("harvesting");
		
		Person person = personRepo.findById(farmerId).get();
		
		if(sowing!=null && !sowing.equals("")){
			person.setProgressPhase("Sowing");
			person.setProgressPercent(Integer.parseInt(sowing));
			
		}else if(irrigation!=null && !irrigation.equals("")){
			person.setProgressPhase("Irrigation");
			person.setProgressPercent(Integer.parseInt(irrigation));
		}else if(harvesting!=null && !harvesting.equals("")){
			person.setProgressPhase("Harvesting");
			person.setProgressPercent(Integer.parseInt(harvesting));
			
		}
		personRepo.save(person);
		return "Success";
	}
	
	
	

}
