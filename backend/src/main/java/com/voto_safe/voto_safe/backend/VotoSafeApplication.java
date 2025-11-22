package com.voto_safe.voto_safe.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
// Estas líneas aseguran que Spring encuentre tus Controllers y Repositorios
@ComponentScan("com.voto_safe.voto_safe.backend")
@EnableJpaRepositories("com.voto_safe.voto_safe.backend.repository")
public class VotoSafeApplication {

	public static void main(String[] args) {
		SpringApplication.run(VotoSafeApplication.class, args);
	}

}