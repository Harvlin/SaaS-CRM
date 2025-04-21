package com.project.Flowgrid;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class FlowgridApplicationTests {

	@Test
	@Disabled("Disabled until database setup is complete")
	void contextLoads() {
	}

}

