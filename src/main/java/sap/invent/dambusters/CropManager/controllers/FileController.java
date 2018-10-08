package sap.invent.dambusters.CropManager.controllers;

import java.sql.Date;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import sap.invent.dambusters.CropManager.entities.Alerts;
import sap.invent.dambusters.CropManager.file.service.FileStorageService;
import sap.invent.dambusters.CropManager.repositories.AlertsRepository;

@RestController
@RequestMapping(BaseApiController.FILE_PATH)
public class FileController {

	private static final Logger logger = LoggerFactory.getLogger(FileController.class);
	
	public static final String API_ROOT_PATH = "/api/file";
	
	@Autowired
	AlertsRepository alertsRepo;

	@Autowired
	private FileStorageService fileStorageService;

	@PostMapping("/upload")
	public String uploadFile(@RequestParam("file") MultipartFile file, @RequestParam String fileType ) {
		String filePath = fileStorageService.storeFile(file, fileType);

		/*String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath().path(API_ROOT_PATH + "/downloadFile/")
				.path(fileName).toUriString();
		logger.info(fileName);*/

		//return new UploadFileResponse(fileName, fileDownloadUri, file.getContentType(), file.getSize());
		return "Recorded";//filePath;
	}
	
	
	@PostMapping("/upload1")
	public String uploadFile(@RequestParam("file") MultipartFile file, @RequestParam String fileType,@RequestParam String description,@RequestParam Integer farmerId  ) {
		String filePath = fileStorageService.storeFile(file, fileType);
		Alerts alert = new Alerts();
		alert.setDescription(description);
		alert.setFarmerId(farmerId);
		alert.setImageUrl(filePath);
		alert.setRemidiation("");
		alert.setStatus(1);
		DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss"); 
		LocalDateTime now = LocalDateTime.now(); 
		alert.setDate(dtf.format(now));
		alertsRepo.save(alert);
		
		
		return "Recorded";
	}

	/*@PostMapping("/uploadMultipleFiles")
	public List<UploadFileResponse> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
		return Arrays.asList(files).stream().map(file -> uploadFile(file)).collect(Collectors.toList());
	}*/

	/*@GetMapping("/downloadFile/{fileName:.+}")
	public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
		// Load file as Resource
		Resource resource = fileStorageService.loadFileAsResource(fileName);

		// Try to determine file's content type
		String contentType = null;
		try {
			contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
		} catch (IOException ex) {
			logger.info("Could not determine file type.");
		}

		// Fallback to the default content type if type could not be determined
		if (contentType == null) {
			contentType = "application/octet-stream";
		}

		return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType))
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
				.body(resource);
	}*/
	
	/*@GetMapping("/getPath")
	public String getFilePath(@RequestParam int id) {
			
		return fileStorageService.getPath(id);
		
	}*/
}
