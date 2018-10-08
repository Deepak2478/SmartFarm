package sap.invent.dambusters.CropManager.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Transient;

@Entity
public class Alerts {
	
	@Id
	@GeneratedValue
	private Integer alertId;
	
	private int status;
	
	private String description;
	
	private String imageUrl;
	
	private String date;
	
	private Integer farmerId;
	
	private String  remidiation;
	
	@Transient
	private String farmerName;
	
	
	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getFarmerName() {
		return farmerName;
	}

	public void setFarmerName(String farmerName) {
		this.farmerName = farmerName;
	}

	public String getRemidiation() {
		return remidiation;
	}

	public void setRemidiation(String remidiation) {
		this.remidiation = remidiation;
	}

	public Integer getAlertId() {
		return alertId;
	}

	public void setAlertId(Integer alertId) {
		this.alertId = alertId;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public Integer getFarmerId() {
		return farmerId;
	}

	public void setFarmerId(Integer farmerId) {
		this.farmerId = farmerId;
	}
	
}
