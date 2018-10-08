package sap.invent.dambusters.CropManager;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "file")
public class FileStorageProperties {
	
	private String uploadDir;
	
	private String diseaseDir;
	
	private String cropDir;

	public String getUploadDir() {
		return uploadDir;
	}

	public void setUploadDir(String uploadDir) {
		this.uploadDir = uploadDir;
	}

	/**
	 * @return the diseaseDir
	 */
	public String getDiseaseDir() {
		return diseaseDir;
	}

	/**
	 * @param diseaseDir the diseaseDir to set
	 */
	public void setDiseaseDir(String diseaseDir) {
		this.diseaseDir = diseaseDir;
	}

	/**
	 * @return the cropDir
	 */
	public String getCropDir() {
		return cropDir;
	}

	/**
	 * @param cropDir the cropDir to set
	 */
	public void setCropDir(String cropDir) {
		this.cropDir = cropDir;
	}
}
