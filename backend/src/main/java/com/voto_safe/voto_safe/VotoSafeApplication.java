package com.voto_safe.voto_safe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

// AGREGAMOS ESTO: (exclude = {DataSourceAutoConfiguration.class})
// Esto le dice: "Arranca la app pero no busques base de datos todavía"
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class VotoSafeApplication {

	public static void main(String[] args) {
		SpringApplication.run(VotoSafeApplication.class, args);
	}

}
