package com.thecodinginterface.awsspringdemo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AwsSpringDemoApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(AwsSpringDemoApplication.class, args);
	}

	static final Logger log = LoggerFactory.getLogger(AwsSpringDemoApplication.class);

	@Value("${my.short-name}")
	String myShortName;

	@Value("${my.full-name:adammcquistan}")
	String myFullName;

	@Override
	public void run(String... args) throws Exception {
		log.info("myShortName={}", myShortName);
		log.info("myFullName={}", myFullName);
	}
}
