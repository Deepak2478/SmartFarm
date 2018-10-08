package sap.invent.dambusters.CropManager.file.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.NoSuchElementException;

import javax.persistence.EntityNotFoundException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import sap.invent.dambusters.CropManager.FileStorageProperties;
import sap.invent.dambusters.CropManager.controllers.FileController;
import sap.invent.dambusters.CropManager.entities.FileEntity;
import sap.invent.dambusters.CropManager.exception.FileStorageException;
import sap.invent.dambusters.CropManager.exception.MyFileNotFoundException;
import sap.invent.dambusters.CropManager.repositories.FileRepository;

@Service
public class FileStorageService {

	private final Path fileStorageLocation;
	
	private final Path diseaseStorageLocation;
	
	private final Path cropStorageLocation;

	@Autowired
	FileRepository fileRepo;

	@Autowired
	public FileStorageService(FileStorageProperties fileStorageProperties) {
		this.fileStorageLocation = Paths.get(fileStorageProperties.getUploadDir()).toAbsolutePath().normalize();
		this.diseaseStorageLocation = Paths.get(fileStorageProperties.getDiseaseDir()).toAbsolutePath().normalize();
		this.cropStorageLocation = Paths.get(fileStorageProperties.getCropDir()).toAbsolutePath().normalize();

		try {
			Files.createDirectories(this.fileStorageLocation);
			Files.createDirectories(this.diseaseStorageLocation);
			Files.createDirectories(this.cropStorageLocation);
		} catch (Exception ex) {
			throw new FileStorageException("Could not create the directory where the uploaded files will be stored.",
					ex);
		}
	}

	public String storeFile(MultipartFile file, String fileType) {
		// Normalize file name
		String fileName = StringUtils.cleanPath(file.getOriginalFilename());

		FileEntity fileEntity = null;

		try {
			// Check if the file's name contains invalid characters
			if (fileName.contains("..")) {
				throw new FileStorageException("Sorry! Filename contains invalid path sequence " + fileName);
			}

			fileEntity = new FileEntity();
			fileEntity.setFileName(fileName);
			fileEntity.setFileType(fileType);
			fileRepo.save(fileEntity);

			fileName = fileEntity.getId() + "-" + fileName;

			// Copy file to the target location (Replacing existing file with the same name)
			// Path targetLocation = this.fileStorageLocation.resolve(fileName);
			
			//Path targetLocation = this.fileStorageLocation.resolve(fileName);
			Path targetLocation = null;
			if(fileType.equals("crop")) {
				targetLocation = this.cropStorageLocation.resolve(fileName);
			} else if (fileType.equals("disease")) {
				targetLocation = this.diseaseStorageLocation.resolve(fileName);
			} else {
				targetLocation = this.fileStorageLocation.resolve(fileName);
			}
			Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
			return targetLocation.toAbsolutePath().toString();
		} catch (IOException ex) {
			if (fileEntity != null) {
				fileRepo.delete(fileEntity);
			}
			throw new FileStorageException("Could not store file " + fileName + ". Please try again!", ex);
		}
	}

	public Resource loadFileAsResource(String fileName) {
		try {
			Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
			Resource resource = new UrlResource(filePath.toUri());
			if (resource.exists()) {
				return resource;
			} else {
				throw new MyFileNotFoundException("File not found " + fileName);
			}
		} catch (MalformedURLException ex) {
			throw new MyFileNotFoundException("File not found " + fileName, ex);
		}
	}

	/*public String getPath(int id) {
		FileEntity fileEntity;
		try {
			fileEntity = fileRepo.findById(id).get();
		} catch (NoSuchElementException e1) {
						throw new EntityNotFoundException("File with id " + id + " not found");
		}
		String fileName = fileEntity.getId() + "-" + fileEntity.getFileName();
		try {
			Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
			Resource resource = new UrlResource(filePath.toUri());
			if (resource.exists()) {
				return filePath.toString();
			} else {
				throw new MyFileNotFoundException("File not found " + fileName);
			}
		} catch (MalformedURLException e) {
			throw new MyFileNotFoundException("File not found " + fileName, e);
		}
	}
*/
}
