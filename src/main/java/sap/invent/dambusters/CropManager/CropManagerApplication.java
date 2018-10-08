package sap.invent.dambusters.CropManager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({ FileStorageProperties.class })
public class CropManagerApplication {

	public static void main(String[] args) {

		SpringApplication.run(CropManagerApplication.class, args);
	}
}
