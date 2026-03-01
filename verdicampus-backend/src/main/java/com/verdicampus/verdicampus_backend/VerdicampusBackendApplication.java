package com.verdicampus.verdicampus_backend;

import com.verdicampus.verdicampus_backend.model.Notice;
import com.verdicampus.verdicampus_backend.repository.NoticeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class VerdicampusBackendApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
		String key = dotenv.get("GEMINI_API_KEY");
		if (key != null && !key.isEmpty()) {
			System.out.println("GEMINI_API_KEY detected in .env file (Length: " + key.length() + ")");
			System.setProperty("GEMINI_API_KEY", key);
		} else {
			System.err.println("CRITICAL: GEMINI_API_KEY NOT FOUND in .env file!");
		}
		SpringApplication.run(VerdicampusBackendApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase(NoticeRepository noticeRepository) {
		return args -> {
			if (noticeRepository.count() == 0) {
				System.out.println("Seeding dummy notices for hackathon...");
				
				noticeRepository.save(new Notice(null, 
					"Holi Holidays 2026", 
					"The campus will remain closed on March 13th and 14th for the Holi celebrations. We wish everyone a colorful and sustainable Green-Holi!", 
					"Event", "Medium", "2026-03-13", null));

				noticeRepository.save(new Notice(null, 
					"Semester Exam Schedule Out", 
					"The final semester examination schedule for Engineering, Law, and Degree wings has been published. Check the student portal for detailed PDF downloads.", 
					"Academic", "High", "2026-04-15", null));
				
				System.out.println("Dummy notices successfully added!");
			}
		};
	}

}
