package org.interview.hmcts;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@Slf4j
public class HmctsApplication
{

	public static void main(String[] args)
	{
		SpringApplication.run(HmctsApplication.class, args);
		log.info("HMCTS Task Service started successfully");
	}

}
