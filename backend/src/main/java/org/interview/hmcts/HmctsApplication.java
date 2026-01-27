package org.interview.hmcts;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HmctsApplication
{

	public static void main(String[] args)
	{
		SpringApplication.run(HmctsApplication.class, args);
	}

}
