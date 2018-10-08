package sap.invent.dambusters.CropManager.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import sap.invent.dambusters.CropManager.entities.Address;
import sap.invent.dambusters.CropManager.entities.Country;
import sap.invent.dambusters.CropManager.entities.Land;
import sap.invent.dambusters.CropManager.entities.Person;
import sap.invent.dambusters.CropManager.entities.Crop;
import sap.invent.dambusters.CropManager.repositories.AddressRepository;
import sap.invent.dambusters.CropManager.repositories.CropRepository;
import sap.invent.dambusters.CropManager.repositories.LandRepository;
import sap.invent.dambusters.CropManager.repositories.PersonRepository;

@RestController
@RequestMapping(BaseApiController.LAND_PATH)
public class LandController {
	
	@Autowired
	LandRepository landRepo;
	
	@Autowired
	AddressRepository adddressRepo;
	
	@Autowired
	PersonRepository personRepo;
	
	@Autowired
	CropRepository cropRepo;
	
	@GetMapping(path="/add") 
	public @ResponseBody String addLand (@RequestParam Integer ownerId
			, @RequestParam Integer addressId, @RequestParam String area,@RequestParam int cropId,@RequestParam String expectedQuantity) {
		
		Land land = new Land();
		land.setArea(area);
		land.setExpectedQuantity(expectedQuantity);
		land.setActualQuantity(null);
		landRepo.save(land);
		return land.getLandId().toString();
	}
	
	@GetMapping(path="/all")
	public @ResponseBody Iterable<Land> getAllLands() {
		// This returns a JSON or XML with the users
		return landRepo.findAll();
	}
	
	

}
