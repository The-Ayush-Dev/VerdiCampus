package com.verdicampus.verdicampus_backend.service;

import com.verdicampus.verdicampus_backend.model.Notice;
import com.verdicampus.verdicampus_backend.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoticeService {

    @Autowired
    private NoticeRepository noticeRepository;

    public List<Notice> getAllNotices() {
        return noticeRepository.findAllByOrderByCreatedAtDesc();
    }

    public Notice createNotice(Notice notice) {
        return noticeRepository.save(notice);
    }

    public Optional<Notice> getNoticeById(Long id) {
        return noticeRepository.findById(id);
    }

    public void deleteNotice(Long id) {
        noticeRepository.deleteById(id);
    }
}
