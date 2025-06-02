package com.lighthouse.concurrent;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

/**
 *  并发操作实现类
 *
 * @author Scout
 * @date 2025-06-02 8:22
 * @since 1.0
 */
public class MyConcurrent {

    public static void main(String[] args) throws ExecutionException, InterruptedException {

        Future<String> stringFuture = executorModel();
        System.out.println(stringFuture.get());

        startThread();
        Thread.currentThread().join();
    }


    private static void startThread() {
        Thread.startVirtualThread(()-> {
            System.out.printf("Thread: %s\n", Thread.currentThread().getName());
        });

        Thread.ofVirtual()
                .name("My thread")
                .uncaughtExceptionHandler((t, e) -> System.out.printf("Thread: %s\n",
                        t.getName()+e.getMessage()))
                .start(() -> {
                    System.out.println("Thread: start02");
                });
    }

    private static Future<String> executorModel() {
        ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
        return executor.submit(() ->
            "java21 virtual thread, I/O 密集型任务."
        );
    }
}