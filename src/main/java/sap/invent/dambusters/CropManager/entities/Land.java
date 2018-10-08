package sap.invent.dambusters.CropManager.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToOne;

@Entity
public class Land {

	@Id
	@GeneratedValue
	private Integer landId;
	
	private String area;
	
	private String expectedQuantity;
	
	private String longitude;
	
	private String latitude;
	
	private String earthEngineUrl;
	
	private String actualQuantity;

	public String getActualQuantity() {
		return actualQuantity;
	}

	public void setActualQuantity(String actualQuantity) {
		this.actualQuantity = actualQuantity;
	}

	public String getEarthEngineUrl() {
		return earthEngineUrl;
	}
	
	public void setEarthEngineUrl(String earthEngineUrl) {
		this.earthEngineUrl = earthEngineUrl;
	}

	public Integer getLandId() {
		return landId;
	}

	public String getLongitude() {
		return longitude;
	}

	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}

	public String getLatitude() {
		return latitude;
	}

	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}

	public void setLandId(Integer landId) {
		this.landId = landId;
	}

	public String getArea() {
		return area;
	}

	public void setArea(String area) {
		this.area = area;
	}
		
	public String getExpectedQuantity() {
		return expectedQuantity;
	}

	public void setExpectedQuantity(String expectedQuantity) {
		this.expectedQuantity = expectedQuantity;
	}

}
