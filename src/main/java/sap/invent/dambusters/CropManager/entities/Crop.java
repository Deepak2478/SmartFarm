package sap.invent.dambusters.CropManager.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Crop {
	
	@Id
	@GeneratedValue
	private Integer cropId;
	private String name;
	private String cropType;
	private String cropSeason;
	
    private String soilType;
    private String soilPhRange;
    private String soilTemp;

    private String seedRate;
    private String sowingDepth;
    private String rowSpacing;
	
    private String irrigation;
	private String fertilizers;
	private String nitrogen;
	private String phosphorous;
	private String potassium;
	
	private String averageYield;
	private String storageTemp;
	private String relativeHumidity;
	
	private int sowingFrom;
	private int sowingTo;
	
	private int harvestingFrom;
	private int harvestingTo;

	private int irrigationFrom;
	private int irrigationTo;
	
	
	public Crop() {
		super();
	}
	
	public Crop(String name, String cropType, String cropSeason, String soilType, String soilPhRange, String soilTemp,
			String seedRate, String sowingDepth, String rowSpacing, String irrigation, String fertilizers,
			String nitrogen, String phosphorous, String potassium, String averageYield, String storageTemp,
			String relativeHumidity, int sowingFrom,int sowingTo, int harvestingFrom, int harvestingTo,int irrigationFrom,int irrigationTo) {
		super();
		this.name = name;
		this.cropType = cropType;
		this.cropSeason = cropSeason;
		this.soilType = soilType;
		this.soilPhRange = soilPhRange;
		this.soilTemp = soilTemp;
		this.seedRate = seedRate;
		this.sowingDepth = sowingDepth;
		this.rowSpacing = rowSpacing;
		this.irrigation = irrigation;
		this.fertilizers = fertilizers;
		this.nitrogen = nitrogen;
		this.phosphorous = phosphorous;
		this.potassium = potassium;
		this.averageYield = averageYield;
		this.storageTemp = storageTemp;
		this.relativeHumidity = relativeHumidity;
		this.sowingFrom=sowingFrom;
		this.sowingTo=sowingTo;
		this.irrigationFrom=irrigationFrom;
		this.irrigationTo=irrigationTo;
		this.harvestingFrom=harvestingFrom;
		this.harvestingTo=harvestingTo;
	}
	/**
	 * @return the cropId
	 */
	public Integer getCropId() {
		return cropId;
	}
	/**
	 * @param cropId the cropId to set
	 */
	public void setCropId(Integer cropId) {
		this.cropId = cropId;
	}
	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}
	/**
	 * @param name the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}
	/**
	 * @return the cropType
	 */
	public String getCropType() {
		return cropType;
	}
	/**
	 * @param cropType the cropType to set
	 */
	public void setCropType(String cropType) {
		this.cropType = cropType;
	}
	/**
	 * @return the cropSeason
	 */
	public String getCropSeason() {
		return cropSeason;
	}
	/**
	 * @param cropSeason the cropSeason to set
	 */
	public void setCropSeason(String cropSeason) {
		this.cropSeason = cropSeason;
	}
	/**
	 * @return the soilType
	 */
	public String getSoilType() {
		return soilType;
	}
	/**
	 * @param soilType the soilType to set
	 */
	public void setSoilType(String soilType) {
		this.soilType = soilType;
	}
	/**
	 * @return the soilPhRange
	 */
	public String getSoilPhRange() {
		return soilPhRange;
	}
	/**
	 * @param soilPhRange the soilPhRange to set
	 */
	public void setSoilPhRange(String soilPhRange) {
		this.soilPhRange = soilPhRange;
	}
	/**
	 * @return the soilTemp
	 */
	public String getSoilTemp() {
		return soilTemp;
	}
	/**
	 * @param soilTemp the soilTemp to set
	 */
	public void setSoilTemp(String soilTemp) {
		this.soilTemp = soilTemp;
	}
	/**
	 * @return the seedRate
	 */
	public String getSeedRate() {
		return seedRate;
	}
	/**
	 * @param seedRate the seedRate to set
	 */
	public void setSeedRate(String seedRate) {
		this.seedRate = seedRate;
	}
	/**
	 * @return the sowingDepth
	 */
	public String getSowingDepth() {
		return sowingDepth;
	}
	/**
	 * @param sowingDepth the sowingDepth to set
	 */
	public void setSowingDepth(String sowingDepth) {
		this.sowingDepth = sowingDepth;
	}
	/**
	 * @return the rowSpacing
	 */
	public String getRowSpacing() {
		return rowSpacing;
	}
	/**
	 * @param rowSpacing the rowSpacing to set
	 */
	public void setRowSpacing(String rowSpacing) {
		this.rowSpacing = rowSpacing;
	}
	/**
	 * @return the irrigation
	 */
	public String getIrrigation() {
		return irrigation;
	}
	/**
	 * @param irrigation the irrigation to set
	 */
	public void setIrrigation(String irrigation) {
		this.irrigation = irrigation;
	}
	/**
	 * @return the fertilizers
	 */
	public String getFertilizers() {
		return fertilizers;
	}
	/**
	 * @param fertilizers the fertilizers to set
	 */
	public void setFertilizers(String fertilizers) {
		this.fertilizers = fertilizers;
	}
	/**
	 * @return the nitrogen
	 */
	public String getNitrogen() {
		return nitrogen;
	}
	/**
	 * @param nitrogen the nitrogen to set
	 */
	public void setNitrogen(String nitrogen) {
		this.nitrogen = nitrogen;
	}
	/**
	 * @return the phosphorous
	 */
	public String getPhosphorous() {
		return phosphorous;
	}
	/**
	 * @param phosphorous the phosphorous to set
	 */
	public void setPhosphorous(String phosphorous) {
		this.phosphorous = phosphorous;
	}
	/**
	 * @return the potassium
	 */
	public String getPotassium() {
		return potassium;
	}
	/**
	 * @param potassium the potassium to set
	 */
	public void setPotassium(String potassium) {
		this.potassium = potassium;
	}
	/**
	 * @return the averageYield
	 */
	public String getAverageYield() {
		return averageYield;
	}
	/**
	 * @param averageYield the averageYield to set
	 */
	public void setAverageYield(String averageYield) {
		this.averageYield = averageYield;
	}
	/**
	 * @return the storageTemp
	 */
	public String getStorageTemp() {
		return storageTemp;
	}
	/**
	 * @param storageTemp the storageTemp to set
	 */
	public void setStorageTemp(String storageTemp) {
		this.storageTemp = storageTemp;
	}
	/**
	 * @return the relativeHumidity
	 */
	public String getRelativeHumidity() {
		return relativeHumidity;
	}
	/**
	 * @param relativeHumidity the relativeHumidity to set
	 */
	public void setRelativeHumidity(String relativeHumidity) {
		this.relativeHumidity = relativeHumidity;
	}

	public int getSowingFrom() {
		return sowingFrom;
	}

	public void setSowingFrom(int sowingFrom) {
		this.sowingFrom = sowingFrom;
	}

	public int getSowingTo() {
		return sowingTo;
	}

	public void setSowingTo(int sowingTo) {
		this.sowingTo = sowingTo;
	}

	public int getHarvestingFrom() {
		return harvestingFrom;
	}

	public void setHarvestingFrom(int harvestingFrom) {
		this.harvestingFrom = harvestingFrom;
	}

	public int getHarvestingTo() {
		return harvestingTo;
	}

	public void setHarvestingTo(int harvestingTo) {
		this.harvestingTo = harvestingTo;
	}

	public int getIrrigationFrom() {
		return irrigationFrom;
	}

	public void setIrrigationFrom(int irrigationFrom) {
		this.irrigationFrom = irrigationFrom;
	}

	public int getIrrigationTo() {
		return irrigationTo;
	}

	public void setIrrigationTo(int irrigationTo) {
		this.irrigationTo = irrigationTo;
	}
	
	

}
