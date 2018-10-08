package sap.invent.dambusters.CropManager.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import sap.invent.dambusters.CropManager.entities.Crop;
import sap.invent.dambusters.CropManager.repositories.CropRepository;

@RestController
@RequestMapping(BaseApiController.CROP_PATH)
public class CropController {

	@Autowired
	CropRepository cropRepo;

	@PostMapping(path = "/add")
	public @ResponseBody String addCrop(@RequestBody Crop crop){
		cropRepo.save(crop);
		return crop.getCropId().toString();
	}

	@GetMapping(path = "/all")
	public @ResponseBody Iterable<Crop> getAllCrops() {
		return cropRepo.findAll();
	}

}
