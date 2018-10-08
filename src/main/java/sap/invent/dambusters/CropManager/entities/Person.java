package sap.invent.dambusters.CropManager.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToOne;

@Entity
public class Person {

	@Id
	@GeneratedValue
	private Integer personId;
	private String name;
	private long contactNumber;
	private String emailId;
	private String progressPhase;
	private int progressPercent;
	private String cropPeriod;

	@OneToOne
	private Address address;

	@OneToOne
	private Land land;

	@OneToOne
	private Crop crop;
	
	public Land getLand() {
		return land;
	}

	public String getCropPeriod() {
		return cropPeriod;
	}

	public void setCropPeriod(String cropPeriod) {
		this.cropPeriod = cropPeriod;
	}

	public void setLand(Land land) {
		this.land = land;
	}

	public Crop getCrop() {
		return crop;
	}

	public void setCrop(Crop crop) {
		this.crop = crop;
	}

	public Integer getPersonId() {
		return personId;
	}

	public void setPersonId(Integer personId) {
		this.personId = personId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public long getContactNumber() {
		return contactNumber;
	}

	public void setContactNumber(long contactNumber) {
		this.contactNumber = contactNumber;
	}

	public Address getAddress() {
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	public String getProgressPhase() {
		return progressPhase;
	}

	public void setProgressPhase(String progressPhase) {
		this.progressPhase = progressPhase;
	}

	public int getProgressPercent() {
		return progressPercent;
	}

	public void setProgressPercent(int progressPercent) {
		this.progressPercent = progressPercent;
	}
	
	
	

}
