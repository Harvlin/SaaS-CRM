package com.project.Flowgrid;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.project.Flowgrid.domain")
@EnableJpaRepositories(basePackages = "com.project.Flowgrid.repository")
@ComponentScan(basePackages = {
        "com.project.Flowgrid.controller",
    "com.project.Flowgrid.service",
    "com.project.Flowgrid.service.impl",
    "com.project.Flowgrid.config",
    "com.project.Flowgrid.mapper",
    "com.project.Flowgrid.repository"
})
public class FlowgridApplication {

	public static void main(String[] args) {
		SpringApplication.run(FlowgridApplication.class, args);
	}

}

